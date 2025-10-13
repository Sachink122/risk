from fastapi import APIRouter

from app.api.v1.endpoints import auth, dprs, evaluate, reports, risk, upload, users

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(upload.router, prefix="/upload", tags=["Upload"])
api_router.include_router(dprs.router, prefix="/dprs", tags=["DPRs"])
api_router.include_router(evaluate.router, prefix="/evaluate", tags=["Evaluation"])
api_router.include_router(risk.router, prefix="/risk", tags=["Risk"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports"])