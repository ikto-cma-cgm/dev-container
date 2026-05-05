package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type HelloResponse struct {
	Message string `json:"message"`
	Service string `json:"service"`
	Status  string `json:"status"`
}

func HelloHandler(c *gin.Context) {
	resp := HelloResponse{
		Message: "Hello from ${{ values.name }}!",
		Service: "${{ values.name }}",
		Status:  "running",
	}

	c.JSON(http.StatusOK, resp)
}
