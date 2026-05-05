package middleware

import (
	"time"

	"github.com/gin-gonic/gin"
)

const (
	maxAge = 12 * time.Hour
)

func Recovery() gin.HandlerFunc {
	return gin.CustomRecovery(func(c *gin.Context, recovered interface{}) {
		c.AbortWithStatusJSON(500, gin.H{
			"error": "internal server error",
		})
	})
}

func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		c.Writer.Header().Set("Access-Control-Max-Age", maxAge.String())

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func Logger() gin.HandlerFunc {
	return gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return param.ClientIP + " " + param.Method + " " + param.Path + " " + statusCodeColor(param.StatusCode) + "\n"
	})
}

func statusCodeColor(code int) string {
	switch {
	case code >= 200 && code < 300:
		return "2xx"
	case code >= 300 && code < 400:
		return "3xx"
	case code >= 400 && code < 500:
		return "4xx"
	default:
		return "5xx"
	}
}
