from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    gemini_api_key: str = ""
    failure_model_path : str = "models/failure_model.pkl"
    rul_model_path: str = "models/rul_model.pkl"
    rul_scaler_path: str = "models/rul_scaler.pkl"
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]


    class Config:
        env_file = ".env"

settings= Settings()