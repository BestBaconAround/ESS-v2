import pkg from '../../package.json'

/**
 * The website version shown in the top bar. It is the version in package.json and changes only when someone bumps it, not on
 * every push. The site itself is published only when asked (see .github/workflows/deploy.yml).
 */
export const VERSION: string = pkg.version
