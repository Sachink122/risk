from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.staticfiles import StaticFiles
from starlette.responses import JSONResponse

from app.api.v1.api import api_router
from app.core.config import settings

app = FastAPI(
    title="DPR-AI API",
    description="AI-Powered DPR Quality Assessment and Risk Prediction System",
    version="1.0.0",
    docs_url=None,
    redoc_url=None,
)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(api_router, prefix="/api/v1")

# Custom docs with government branding
@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=f"{app.title} - API Documentation",
        swagger_js_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.19.0/swagger-ui-bundle.js",
        swagger_css_url="https://cdn.jsdelivr.net/npm/swagger-ui-dist@4.19.0/swagger-ui.css",
        swagger_favicon_url="/static/favicon.ico",
    )

@app.get("/", include_in_schema=False)
async def root():
    return JSONResponse(
        status_code=200,
        content={
            "message": "Welcome to DPR-AI API",
            "docs": "/docs",
            "version": app.version,
        },
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)