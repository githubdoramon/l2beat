import { HttpClient, Logger, MainnetEtherscanClient } from '@l2beat/shared'
import { providers } from 'ethers'

import { handleCli } from './cli/handleCli'
import {
  DiscoveryCliConfig,
  getDiscoveryCliConfig,
} from './config/config.discovery'
import { ConfigReader } from './core/discovery/config/ConfigReader'
import { runDiscovery } from './core/discovery/runDiscovery'
import { runInversion } from './core/inversion/runInversion'

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

async function main() {
  const cli = handleCli()
  const config = getDiscoveryCliConfig(cli)
  const logger = Logger.DEBUG

  await discover(config, logger)
  await invert(config, logger)
}

async function discover(config: DiscoveryCliConfig, logger: Logger) {
  if (!config.discovery) {
    return
  }

  const http = new HttpClient()
  const provider = new providers.AlchemyProvider(
    'mainnet',
    config.discovery.alchemyApiKey,
  )
  const etherscanClient = new MainnetEtherscanClient(
    http,
    config.discovery.etherscanApiKey,
  )
  const configReader = new ConfigReader()

  logger = logger.for('Discovery')
  logger.info('Starting')

  await runDiscovery(provider, etherscanClient, configReader, config.discovery)
}

async function invert(config: DiscoveryCliConfig, logger: Logger) {
  if (!config.invert) {
    return
  }

  const { file, useMermaidMarkup } = config.invert

  logger = logger.for('Inversion')
  logger.info('Starting')

  await runInversion(file, useMermaidMarkup)
}
