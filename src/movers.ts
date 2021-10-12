// Copyright (C) 2020  Aaron Satterlee

import { Arguments } from "yargs";
import {apiGet} from "./tdapiinterface";

export enum INDEX {
    COMPX = '$COMPX',
    DJI = '$DJI',
    SPX = '$SPX.X',
}

export enum DIRECTION {
    UP = 'up',
    DOWN = 'down',
}

export enum CHANGE {
    PERCENT = 'percent',
    VALUE = 'value',
}

/**
 * Get market movers for a specified major index, Nasdaq Composite, Dow, S&P (use ENUM)
 * a given direction, up or down (use ENUM), and the type of change, value or percent (use ENUM)
 * Can optionally use apikey for delayed data with an unauthenticated request.
 * @param {Object} config - takes index (ENUM is INDEX), direction (ENUM is DIRECTION), change (ENUM is CHANGE), apikey (optional)
 * @returns {Promise<Object>} api GET result
 * @async
 */
export async function getMovers(config: any) {
    config.path = `/v1/marketdata/${config.index}/movers` +
        `?direction=${config.direction}` +
        `&change=${config.change}` +
        (config.apikey ? `&apikey=${config.apikey}` : '');

    return apiGet(config);
}

export default {
    command: 'movers <command>',
    desc: 'Get market movers',
    builder: (yargs: any) => {
        return yargs
            .command('get <majorIndex> <direction> <change> [apikey]',
                `Get market movers for a specified <majorIndex> ('$COMPX', '$DJI', '$SPX.X'), a given <direction> ('up', 'down'), and the type of <change> ('value', 'percent'), e.g. "get \\$DJI up percent" (notice the escape character). Optionally takes an apikey for an unathenticated request.`,
                {},
                async (argv: Arguments) => {
                    if (argv.verbose) {
                        console.log(`getting market movers for ${argv.majorIndex}, moving ${argv.direction} by ${argv.change}`);
                    }
                    return getMovers({
                        index: argv.majorIndex,
                        direction: argv.direction,
                        change: argv.change,
                        verbose: argv.verbose || false,
                        apikey: argv.apikey
                    }).then(data => JSON.stringify(data, null, 2)).then(console.log).catch(console.log);
                });
    },
    handler: (argv: Arguments) => {},
};
