package config

import (
	"os"
)

type Config struct {
	Addr string
	Port string
}

func Load() (*Config, error) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	addr := ":" + port

	return &Config{
		Addr: addr,
		Port: port,
	}, nil
}
