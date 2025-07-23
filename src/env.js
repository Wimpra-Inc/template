const { z } = require('zod')

const envSchema = z.object({
  EXECUTABLE_PATH: z.string().nullable(),
  PATH_DOWNLOAD: z.string().nullable(),
  HEADLESS: z.union([
    z.literal('new'),
    z.string().transform((value) => value === 'true')
  ]),
  USER_DATA_DIR: z.string().nullable(),
  SLOW_MO: z.string().transform((value) => +value),
  ARGS: z.string().transform((value) => value.split(',')),
  IGNORE_DEFAULT_ARGS: z.string().transform((value) => value.split(',')),
  IGNORE_HTTP_ERRORS: z.string().transform((value) => value === 'true'),
  DEFAULT_VIEW_PORT: z.string().transform((value) => JSON.parse(value)),
  SET_DEFAULT_TIMEOUT: z.string().transform((value) => +value),
  SET_DEFAULT_NAVIGATION_TIMEOUT: z.string().transform((value) => +value),
  CREATE_BROWSER_BY_WS_ENDPOINT: z
    .string()
    .transform((value) => value === 'true'),
  CHROME_REMOTE_DEBUGGING_URL: z.string(),
  URL_SUBMIT_CAPTCHA: z.string().nullable(),
  URL_SOLUTION_CAPTCHA: z.string().nullable(),
  API_KEY_CAPTCHA: z.string().nullable(),
  TIMEOUT_NORMAL_CAPTCHA: z.string().transform((value) => +value),
  FILE_NAME_DOWNLOAD: z.union([z.string(), z.undefined()]),
  MUST_START_AT: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: 'O campo MUST_START_AT deve estar no formato "hh:mm"'
    })
    .optional(),
  MUST_FINISH_AT: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
      message: 'O campo MUST_START_AT deve estar no formato "hh:mm"'
    })
    .optional(),
  CHROME_PROFILE_DIRECTORY: z.string().nullable()
})

const env = envSchema.parse(process.env)

env.ARGS.push(`--profile-directory=${env.CHROME_PROFILE_DIRECTORY}`)

module.exports = {
  env
}
