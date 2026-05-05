package handler

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"
)

func TestHelloHandler(t *testing.T) {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.GET("/api/v1/hello", HelloHandler)

	req, _ := http.NewRequest(http.MethodGet, "/api/v1/hello", nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", w.Code)
	}

	if !strings.Contains(w.Body.String(), "Hello") {
		t.Errorf("expected response to contain 'Hello', got: %s", w.Body.String())
	}
}
