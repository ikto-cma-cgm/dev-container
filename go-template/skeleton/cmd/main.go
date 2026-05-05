package main

import (
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"github.com/cma-cgm/${{ values.name }}/internal/config"
	"github.com/cma-cgm/${{ values.name }}/internal/middleware"
	"github.com/cma-cgm/${{ values.name }}/internal/health"
	"github.com/cma-cgm/${{ values.name }}/internal/handler"

	"github.com/gin-gonic/gin"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}))

	cfg, err := config.Load()
	if err != nil {
		logger.Error("failed to load config", slog.String("error", err.Error()))
		os.Exit(1)
	}

	gin.SetMode(gin.ReleaseMode)
	r := gin.New()

	r.Use(middleware.Recovery())
	r.Use(middleware.Logger())
	r.Use(middleware.CORS())

	r.GET("/health", health.HealthHandler)
	r.GET("/ready", health.ReadyHandler)

	r.GET("/api/v1/hello", handler.HelloHandler)

	go func() {
		logger.Info("server starting", slog.String("addr", cfg.Addr))
		if err := r.Run(cfg.Addr); err != nil {
			logger.Error("server failed", slog.String("error", err.Error()))
			os.Exit(1)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Info("server shutting down gracefully")
}
