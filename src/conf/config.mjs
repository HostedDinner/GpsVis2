const modes = Object.freeze({
    line: 0,
    pixel: 1,
    metaPixel: 2,
});

const defaultConfig = {
    mapWidth: 2500,
    padding: 40,
    backgroundColor: 'rgba(0, 0, 0 , 1)',
    strokeColor: 'rgba(216, 90, 0 , 0.4)',
    mode: modes.line,
    metaPixel: {
        width: 5,
        spacing: 1,
    },
};

const mergeDefaultConfig = function(userConfig) {
    return {...defaultConfig, ...userConfig};
};

export { mergeDefaultConfig, modes };