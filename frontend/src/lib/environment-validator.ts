/**
 * Environment validation for Google OAuth2 configuration
 */
import React from 'react'

interface EnvironmentConfig {
  NEXTAUTH_URL: string
  NEXTAUTH_SECRET: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  NEXT_PUBLIC_API_URL: string
}

class ConfigurationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConfigurationError'
  }
}

export class EnvironmentValidator {
  private static requiredVars: (keyof EnvironmentConfig)[] = [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET', 
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NEXT_PUBLIC_API_URL'
  ]

  /**
   * Validate all required environment variables
   */
  static validateEnvironment(): EnvironmentConfig {
    const missing: string[] = []
    const config: Partial<EnvironmentConfig> = {}

    // Check each required variable
    for (const varName of this.requiredVars) {
      const value = process.env[varName]
      
      if (!value || value.trim() === '') {
        missing.push(varName)
      } else {
        config[varName] = value.trim()
      }
    }

    // Throw error if any variables are missing
    if (missing.length > 0) {
      throw new ConfigurationError(
        `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env.local file and ensure all Google OAuth2 variables are set.'
      )
    }

    // Additional validation
    this.validateSpecificValues(config as EnvironmentConfig)

    return config as EnvironmentConfig
  }

  /**
   * Validate specific environment variable formats
   */
  private static validateSpecificValues(config: EnvironmentConfig) {
    // Validate NEXTAUTH_URL format
    try {
      new URL(config.NEXTAUTH_URL)
    } catch {
      throw new ConfigurationError(
        `NEXTAUTH_URL must be a valid URL. Got: ${config.NEXTAUTH_URL}`
      )
    }

    // Validate NEXTAUTH_SECRET length
    if (config.NEXTAUTH_SECRET.length < 32) {
      throw new ConfigurationError(
        'NEXTAUTH_SECRET must be at least 32 characters long for security'
      )
    }

    // Validate Google Client ID format
    if (!config.GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com')) {
      console.warn(
        'GOOGLE_CLIENT_ID format may be incorrect. Expected format: xxx.apps.googleusercontent.com'
      )
    }

    // Validate API URL format
    try {
      new URL(config.NEXT_PUBLIC_API_URL)
    } catch {
      throw new ConfigurationError(
        `NEXT_PUBLIC_API_URL must be a valid URL. Got: ${config.NEXT_PUBLIC_API_URL}`
      )
    }
  }

  /**
   * Get validated configuration or throw error
   */
  static getConfig(): EnvironmentConfig {
    try {
      return this.validateEnvironment()
    } catch (error) {
      if (error instanceof ConfigurationError) {
        console.error('❌ Configuration Error:', error.message)
        
        // In development, provide helpful guidance
        if (process.env.NODE_ENV === 'development') {
          console.log('\n🔧 To fix this:')
          console.log('1. Copy .env.example to .env.local')
          console.log('2. Set up Google OAuth2 credentials in Google Cloud Console')
          console.log('3. Fill in all required environment variables')
          console.log('4. Restart your development server')
          console.log('\nSee docs/GOOGLE_OAUTH2_SETUP.md for detailed instructions')
        }
      }
      
      throw error
    }
  }

  /**
   * Check if environment is properly configured (non-throwing)
   */
  static isConfigured(): boolean {
    try {
      this.validateEnvironment()
      return true
    } catch {
      return false
    }
  }

  /**
   * Get configuration issues for debugging
   */
  static getConfigurationIssues(): string[] {
    const issues: string[] = []

    for (const varName of this.requiredVars) {
      const value = process.env[varName]
      
      if (!value) {
        issues.push(`${varName} is not set`)
      } else if (value.trim() === '') {
        issues.push(`${varName} is empty`)
      } else if (varName === 'NEXTAUTH_SECRET' && value.length < 32) {
        issues.push(`${varName} is too short (minimum 32 characters)`)
      }
    }

    return issues
  }
}

/**
 * React hook for environment validation
 */
export function useEnvironmentValidation() {
  const [isValid, setIsValid] = React.useState<boolean>(false)
  const [issues, setIssues] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  React.useEffect(() => {
    try {
      EnvironmentValidator.getConfig()
      setIsValid(true)
      setIssues([])
    } catch (error) {
      setIsValid(false)
      setIssues(EnvironmentValidator.getConfigurationIssues())
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { isValid, issues, isLoading }
}

// Export validated config for use in other modules
let validatedConfig: EnvironmentConfig | null = null

export function getValidatedConfig(): EnvironmentConfig {
  if (!validatedConfig) {
    validatedConfig = EnvironmentValidator.getConfig()
  }
  return validatedConfig
}

export default EnvironmentValidator