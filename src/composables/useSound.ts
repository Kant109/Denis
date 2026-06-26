export function useSound() {
    const sounds = new Map<string, HTMLAudioElement>();

    const register = (name: string, path: string) => {
        sounds.set(name, new Audio(path));
    };

    const play = (name: string) => {
        const audio = sounds.get(name);

        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
        audio.play();
    };

    const stop = (name: string) => {
        const audio = sounds.get(name);

        if (!audio) return;

        audio.pause();
        audio.currentTime = 0;
    };

    register('victory', '/sounds/victory.mp3');
    register('matis', '/sounds/walk-on-matis.mp3');
    register('lilian', '/sounds/walk-on-lilian.mp3');
    register('simon', '/sounds/walk-on-simon.mp3');
    register('quentin', '/sounds/walk-on-quentin.mp3');

    return { play, stop };
}