export interface ViewPort {
    width: number
    height: number
}

export interface IBrowser {
    executablePath: string
    args: Array<string>
    headless: boolean
    slowMo: number
    ignoreHTTPSErrors: boolean
    userDataDir: string,
    defaultViewport: ViewPort
    ignoreDefaultArgs: Array<string>
    defaultTimeout: number
    defaultNavigationTimeout: number

}
