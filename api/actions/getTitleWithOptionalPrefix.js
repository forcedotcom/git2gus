function getTitleWithOptionalPrefix(config, title) {
    if (config.gusTitlePrefix) {
        return config.gusTitlePrefix.concat(' ', title);
    }
    return title;
}
exports.getTitleWithOptionalPrefix = getTitleWithOptionalPrefix;
