import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

export const useX01GameStore = defineStore('X01Game', () => {
    const STORAGE_KEY = 'x01-store-v1';

    const gamesById = ref<Record<number, X01GameSession>>({});
    const gameOrder = ref<number[]>([]);
    const finishedGameIds = ref<number[]>([]);
    const activeGameId = ref<number | null>(null);
    const nextGameId = ref(1);

    const draftPlayers = ref([] as Array<X01Player>);
    const undoStack = ref<Array<{
        players: X01Player[],
        status: 'active' | 'finished',
        endedAt?: string,
        winnerPlayer?: X01Player,
        finishedGameIds: number[],
    }>>([]);

    const games = ref({
        id: 0,
        players: [],
        mode: '301',
        sets: 1,
        legs: 1,
    } as X01Game);

    const activeGame = computed(() => {
        if(activeGameId.value === null) return null;
        return gamesById.value[activeGameId.value] || null;
    });

    const players = computed({
        get: () => activeGame.value ? activeGame.value.players : draftPlayers.value,
        set: (newPlayers: X01Player[]) => {
            if(activeGame.value) {
                activeGame.value.players = newPlayers;
            } else {
                draftPlayers.value = newPlayers;
            }
        }
    });

    const isGameFinish = computed({
        get: () => activeGame.value?.status === 'finished',
        set: (newIsGameFinish: boolean) => {
            if(!activeGame.value) return;
            activeGame.value.status = newIsGameFinish ? 'finished' : 'active';
            if(newIsGameFinish) {
                activeGame.value.endedAt = new Date().toISOString();
                if(!finishedGameIds.value.includes(activeGame.value.id)) {
                    finishedGameIds.value.push(activeGame.value.id);
                }
            }
        }
    });

    const winnerPlayer = computed({
        get: () => activeGame.value?.winnerPlayer || ({} as X01Player),
        set: (winner: X01Player) => {
            if(!activeGame.value) return;
            activeGame.value.winnerPlayer = winner;
            if(Object.keys(winner).length > 0) {
                activeGame.value.status = 'finished';
                activeGame.value.endedAt = new Date().toISOString();
                if(!finishedGameIds.value.includes(activeGame.value.id)) {
                    finishedGameIds.value.push(activeGame.value.id);
                }
            }
        }
    });

    const mode = ref('301' as '301' | '501');

    function pointsFromMode(currentMode: '301' | '501'): number {
        return currentMode === '301' ? 301 : 501;
    }

    function getActivePlayerIndex(currentPlayers: X01Player[]): number {
        const activeIndex = currentPlayers.findIndex((player) => player.isActive);
        return activeIndex >= 0 ? activeIndex : 0;
    }

    function ensureCurrentVolley(player: X01Player) {
        if(player.volleys.length === 0) {
            player.volleys.push(['', '', '']);
        }
    }

    function setNextPlayerActive(currentPlayers: X01Player[], currentPlayerIndex: number) {
        currentPlayers[currentPlayerIndex].isActive = false;
        const nextPlayerIndex = currentPlayerIndex + 1 === currentPlayers.length ? 0 : currentPlayerIndex + 1;
        currentPlayers[nextPlayerIndex].isActive = true;
        ensureCurrentVolley(currentPlayers[nextPlayerIndex]);
        if(currentPlayers[nextPlayerIndex].volleys[currentPlayers[nextPlayerIndex].volleys.length - 1].every(dart => dart !== '')) {
            currentPlayers[nextPlayerIndex].volleys.push(['', '', '']);
        }
    }

    function resetPlayersForNewRound(currentPlayers: X01Player[], starterIndex: number) {
        currentPlayers.forEach((player, index) => {
            player.points = pointsFromMode(activeGame.value!.mode);
            player.isActive = index === starterIndex;
            player.volleys = index === starterIndex ? [['', '', '']] : [];
        });
    }

    function clearDraftPlayers() {
        draftPlayers.value = [];
    }

    function deepClonePlayers(sourcePlayers: X01Player[]): X01Player[] {
        return JSON.parse(JSON.stringify(sourcePlayers));
    }

    function deepCloneWinner(sourceWinner?: X01Player): X01Player | undefined {
        if(!sourceWinner) return undefined;
        return JSON.parse(JSON.stringify(sourceWinner));
    }

    function pushUndoSnapshot() {
        if(!activeGame.value) return;

        undoStack.value.push({
            players: deepClonePlayers(activeGame.value.players),
            status: activeGame.value.status,
            endedAt: activeGame.value.endedAt,
            winnerPlayer: deepCloneWinner(activeGame.value.winnerPlayer),
            finishedGameIds: [...finishedGameIds.value],
        });

        if(undoStack.value.length > 100) {
            undoStack.value.shift();
        }
    }

    function setPlayer(player: X01Player) {
        draftPlayers.value.push(player);
    }

    function setIsGameFinish(newIsGameFinish: boolean) {
        isGameFinish.value = newIsGameFinish;
    }

    function setWinner(winner: X01Player) {
        winnerPlayer.value = winner;
    }

    function buildReplayPlayers(sourcePlayers: X01Player[], replayMode: '301' | '501'): X01Player[] {
        return sourcePlayers.map((player, index) => ({
            ...player,
            isActive: index === 0,
            points: pointsFromMode(replayMode),
            volleys: index === 0 ? [['', '', '']] : [],
            sets: 0,
            legs: 0,
            average: 0,
            nbThrows: 0,
            nbDarts: 0,
        }));
    }

    function startGameFromDraft() {
        if(draftPlayers.value.length === 0) return;

        undoStack.value = [];

        const currentGame: X01GameSession = {
            id: nextGameId.value,
            players: draftPlayers.value,
            mode: mode.value,
            sets: Number(games.value.sets),
            legs: Number(games.value.legs),
            status: 'active',
            startedAt: new Date().toISOString(),
        };

        gamesById.value[currentGame.id] = currentGame;
        gameOrder.value.push(currentGame.id);
        activeGameId.value = currentGame.id;
        nextGameId.value += 1;
        draftPlayers.value = [];
    }

    function replayActiveGame() {
        if(!activeGame.value) return;

        const replayMode = activeGame.value.mode;
        const replaySets = activeGame.value.sets;
        const replayLegs = activeGame.value.legs;
        draftPlayers.value = buildReplayPlayers(activeGame.value.players, replayMode);
        mode.value = replayMode;
        games.value.sets = replaySets;
        games.value.legs = replayLegs;
        startGameFromDraft();
    }

    function applyThrow(points: number, multiplier: 1 | 2 | 3 = 1) {
        if(!activeGame.value || activeGame.value.status === 'finished') return;

        pushUndoSnapshot();

        const currentPlayers = activeGame.value.players;
        if(currentPlayers.length === 0) return;

        const activePlayerIndex = getActivePlayerIndex(currentPlayers);
        const currentPlayer = currentPlayers[activePlayerIndex];
        ensureCurrentVolley(currentPlayer);

        const currentVolley = currentPlayer.volleys[currentPlayer.volleys.length - 1];
        const dartLabel = multiplier === 2 ? `D${points}` : multiplier === 3 ? `T${points}` : points.toString();
        let hasEndedTurn = false;

        currentPlayer.points -= multiplier * points;

        if(currentVolley[0] === '') {
            currentVolley[0] = dartLabel;
        } else if(currentVolley[1] === '') {
            currentVolley[1] = dartLabel;
        } else if(currentVolley[2] === '') {
            currentVolley[2] = dartLabel;
            hasEndedTurn = true;
        }

        if(currentPlayer.points < 0 || currentPlayer.points === 1) {
            currentPlayer.points += multiplier * points;
            currentVolley[0] = currentVolley[0] === '' ? '' : `O${currentVolley[0]}`;
            currentVolley[1] = currentVolley[1] === '' ? '' : `O${currentVolley[1]}`;
            currentVolley[2] = currentVolley[2] === '' ? '' : `O${currentVolley[2]}`;
            setNextPlayerActive(currentPlayers, activePlayerIndex);
            return;
        }

        if(currentPlayer.points === 0) {
            if(multiplier !== 2) {
                currentPlayer.points += multiplier * points;
                setNextPlayerActive(currentPlayers, activePlayerIndex);
                return;
            }
            currentPlayer.legs += 1;

            if(currentPlayer.legs >= activeGame.value.legs) {
                currentPlayer.sets += 1;

                if(currentPlayer.sets >= activeGame.value.sets) {
                    winnerPlayer.value = currentPlayer;
                    isGameFinish.value = true;
                    return;
                }

                currentPlayers.forEach((player) => {
                    player.legs = 0;
                });
            }

            resetPlayersForNewRound(currentPlayers, activePlayerIndex);
            return;
        }

        if(hasEndedTurn) {
            setNextPlayerActive(currentPlayers, activePlayerIndex);
        }
    }

    function pointsFromDart(previousDart: string): number {
        if(previousDart.startsWith('O')) return 0;
        const cleanDart = previousDart.startsWith('O') ? previousDart.substring(1) : previousDart;
        const multiplier = cleanDart.includes('T') ? 3 : cleanDart.includes('D') ? 2 : 1;
        const parsedPoints = multiplier === 1 ? parseInt(cleanDart) : parseInt(cleanDart.substring(1, 3));
        return (parsedPoints || 0) * multiplier;
    }

    function removePreviousDart(player: X01Player): boolean {
        if(player.volleys.length === 0) return false;
        const lastVolley = player.volleys[player.volleys.length - 1];

        for(let index = 2; index >= 0; index--) {
            const previousDart = lastVolley[index];
            if(previousDart !== '') {
                player.points += pointsFromDart(previousDart);
                lastVolley[index] = '';
                return true;
            }
        }

        return false;
    }

    function undoThrow() {
        if(!activeGame.value || activeGame.value.players.length === 0) return;

        const lastSnapshot = undoStack.value.pop();
        if(lastSnapshot) {
            activeGame.value.players = deepClonePlayers(lastSnapshot.players);
            activeGame.value.status = lastSnapshot.status;
            activeGame.value.endedAt = lastSnapshot.endedAt;
            activeGame.value.winnerPlayer = deepCloneWinner(lastSnapshot.winnerPlayer);
            finishedGameIds.value = [...lastSnapshot.finishedGameIds];
            return;
        }

        if(activeGame.value.status === 'finished') {
            activeGame.value.status = 'active';
            activeGame.value.endedAt = undefined;
            activeGame.value.winnerPlayer = undefined;
            finishedGameIds.value = finishedGameIds.value.filter((gameId) => gameId !== activeGame.value!.id);
        }

        const currentPlayers = activeGame.value.players;
        const activePlayerIndex = getActivePlayerIndex(currentPlayers);
        const activePlayer = currentPlayers[activePlayerIndex];

        if(activePlayer.volleys.length === 0) return;

        const activeVolley = activePlayer.volleys[activePlayer.volleys.length - 1];
        const isFirstTurn = activePlayerIndex === 0 && activePlayer.volleys.length === 1 && activeVolley[0] === '' && activeVolley[1] === '' && activeVolley[2] === '';

        if(isFirstTurn) return;

        const hasCurrentDart = activeVolley.some((dart) => dart !== '');

        if(hasCurrentDart) {
            removePreviousDart(activePlayer);
            return;
        }

        activePlayer.isActive = false;
        const previousPlayerIndex = activePlayerIndex - 1 >= 0 ? activePlayerIndex - 1 : currentPlayers.length - 1;
        const previousPlayer = currentPlayers[previousPlayerIndex];
        previousPlayer.isActive = true;

        if(activePlayer.volleys.length > 0 && activeVolley.every((dart) => dart === '')) {
            activePlayer.volleys.pop();
        }

        removePreviousDart(previousPlayer);
    }

    function syncActiveGame(payload: { players: X01Player[], isGameFinish: boolean }) {
        if(!activeGame.value) {
            const syncedPlayers = payload.players || [];
            if(syncedPlayers.length > 0 && !payload.isGameFinish) {
                draftPlayers.value = syncedPlayers;
                startGameFromDraft();
            }
        }

        if(!activeGame.value) return;
        activeGame.value.players = payload.players;
        isGameFinish.value = payload.isGameFinish;
    }

    function persist() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            gamesById: gamesById.value,
            gameOrder: gameOrder.value,
            finishedGameIds: finishedGameIds.value,
            activeGameId: activeGameId.value,
            nextGameId: nextGameId.value,
            draftPlayers: draftPlayers.value,
            games: games.value,
            mode: mode.value,
        }));
    }

    function hydrate() {
        const storedValue = localStorage.getItem(STORAGE_KEY);
        if(!storedValue) return;

        try {
            const data = JSON.parse(storedValue);
            gamesById.value = data.gamesById || {};
            gameOrder.value = data.gameOrder || [];
            finishedGameIds.value = data.finishedGameIds || [];
            activeGameId.value = data.activeGameId ?? null;
            nextGameId.value = data.nextGameId || 1;
            draftPlayers.value = data.draftPlayers || [];
            games.value = data.games || games.value;
            mode.value = data.mode || '301';
        } catch {
            reset();
        }
    }

    function reset() {
        gamesById.value = {};
        gameOrder.value = [];
        finishedGameIds.value = [];
        activeGameId.value = null;
        nextGameId.value = 1;
        draftPlayers.value = [];
        undoStack.value = [];
        games.value = {
            id: 0,
            players: [],
            mode: '301',
            sets: 1,
            legs: 1,
        };
        mode.value = '301';
        localStorage.removeItem(STORAGE_KEY);
    }

    hydrate();

    watch([gamesById, gameOrder, finishedGameIds, activeGameId, nextGameId, draftPlayers, games, mode], () => {
        persist();
    }, { deep: true });

    return {
        players,
        games,
        isGameFinish,
        winnerPlayer,
        mode,
        gamesById,
        gameOrder,
        finishedGameIds,
        activeGameId,
        activeGame,
        clearDraftPlayers,
        setPlayer,
        setIsGameFinish,
        setWinner,
        startGameFromDraft,
        replayActiveGame,
        applyThrow,
        undoThrow,
        syncActiveGame,
        reset,
    };
})