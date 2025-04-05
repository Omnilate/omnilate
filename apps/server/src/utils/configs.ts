interface Configs {
  accessToken: {
    secret: string
    expiresIn: string
  }
}

export function getConfigs (): Configs {
  return {
    accessToken: {
      secret: process.env.JWT_SECRET ?? 'secret',
      expiresIn: process.env.JWT_EXPIRES_IN ?? '1h'
    }
  }
}
