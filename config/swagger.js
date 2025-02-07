export const  swagger ={
    "openapi": "3.0.0",
    "info": {
      "title": "Custom URL Shortener API",
      "version": "1.0.0",
      "description": "A scalable URL shortener with analytics, Google authentication, and rate limiting."
    },
    "servers": [
      {
        "url": "http://localhost:5000",
        "description": "Local development server"
      }
    ],
    "components": {
      "securitySchemes": {
        "Authorization": {
          "type": "http",
          "scheme": "bearer",
          "bearerFormat": "JWT"
        }
      }
    },
    "security": [
      {
        "Authorization": []
      }
    ],
    "paths": {
      "/auth/google": {
        "get": {
          "summary": "Authenticate with Google",
          "description": "Redirects to Google's OAuth2 login page.",
          "responses": {
            "200": {
              "description": "Provide link to Google OAuth2 login."
            }
          }
        }
      },
      "/auth/google/callback": {
        "get": {
          "summary": "Google OAuth2 Callback",
          "description": "Handles Google OAuth2 login and issues a JWT token.",
          "responses": {
            "200": {
              "description": "Returns JWT token.",
              "content": {
                "application/json": {
                  "example": {
                    "token": "your_jwt_token_here"
                  }
                }
              }
            }
          }
        }
      },
      "/api/shorten": {
        "post": {
          "summary": "Create a Short URL",
          "description": "Shortens a long URL and returns a short URL.",
          "security": [
            {
              "Authorization": []
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "longUrl": { "type": "string", "example": "https://example.com/long-url" },
                    "customAlias": { "type": "string", "example": "my-short-url" },
                    "topic": { "type": "string", "example": "activation" }
                  }
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": "Short URL created successfully.",
              "content": {
                "application/json": {
                  "example": {
                    "shortUrl": "my-short-url",
                    "createdAt": "2025-02-01T12:00:00Z"
                  }
                }
              }
            },
            "400": {
              "description": "Invalid request data."
            }
          }
        }
      },
      "/api/shorten/{alias}": {
        "get": {
          "summary": "Redirect to Long URL",
          "description": "Redirects a short URL to its original long URL.",
          "security": [
            {
              "Authorization": []
            }
          ],
          "parameters": [
            {
              "name": "alias",
              "in": "path",
              "required": true,
              "schema": { "type": "string" }
            }
          ],
          "responses": {
            "200": {
              "description": "Redirects to the original long URL."
            },
            "400": {
              "description": "Short URL not found."
            }
          }
        }
      },

      "/api/analytics/{alias}": {
        "get": {
          "summary": "Get Short URL Analytics",
          "description": "Fetches analytics for a specific short URL.",
          "security": [
            {
              "Authorization": []
            }
          ],
          "parameters": [
            {
              "name": "alias",
              "in": "path",
              "required": true,
              "schema": { "type": "string" }
            }
          ],
          "responses": {
            "200": {
              "description": "Analytics data.",
              "content": {
                "application/json": {
                  "example": {
                    "totalClicks": 120,
                    "uniqueUsers": 90,
                    "clicksByDate": [
                      { "date": "2025-01-25", "clicks": 10 },
                      { "date": "2025-01-26", "clicks": 15 }
                    ],
                    "osType": [
                      { "osName": "Windows", "uniqueClicks": 50, "uniqueUsers": 40 }
                    ],
                    "deviceType": [
                      { "deviceName": "mobile", "uniqueClicks": 70, "uniqueUsers": 60 }
                    ]
                  }
                }
              }
            },
            "400": {
              "description": "Short URL not found."
            }
          }
        }
      },
      "/api/analytics/topic/{topic}": {
        "get": {
          "summary": "Get URL Topic Analytics",
          "description": "Fetches analytics for a specific topic.",
          "security": [
            {
              "Authorization": []
            }
          ],
          "parameters": [
            {
              "name": "topic",
              "in": "path",
              "required": true,
              "schema": { "type": "string" }
            }
          ],
          "responses": {
            "200": {
              "description": "Analytics data.",
              "content": {
                "application/json": {
                  "example": {
                    "totalClicks": 120,
                    "uniqueUsers": 90,
                    "clicksByDate": [
                      { "date": "2025-01-25", "clicks": 10 },
                      { "date": "2025-01-26", "clicks": 15 }
                    ],
                    "urls": [
                      { "url": "example", "totalClicks": 50, "uniqueUsers": 40 }
                    ]
                  }
                }
              }
            },
            "400": {
              "description": "No URLs found for this topic"
            }
          }
        }
      },

      "/api/analytics/overall": {
        "get": {
          "summary": "Get Overall URL Analytics",
          "description": "Fetches overall analytics for URL's created by a specific user.",
          "security": [
            {
              "Authorization": []
            }
          ],
          "responses": {
            "200": {
              "description": "Analytics data.",
              "content": {
                "application/json": {
                  "example": {
                    "totalClicks": 120,
                    "uniqueUsers": 90,
                    "clicksByDate": [
                      { "date": "2025-01-25", "clicks": 10 },
                      { "date": "2025-01-26", "clicks": 15 }
                    ],
                    "osType": [
                      { "osName": "Windows", "uniqueClicks": 50, "uniqueUsers": 40 }
                    ],
                    "deviceType": [
                      { "deviceName": "mobile", "uniqueClicks": 70, "uniqueUsers": 60 }
                    ]
                  }
                }
              }
            },
            "400": {
              "description":  "No URLs found for this user"
            }
          }
        }
      },


    }
  }
  