from pydantic import BaseModel, Field

class SubmissionSuccessResponse(BaseModel):
    success: bool = Field(default=True, description="Indicates if the operation succeeded")
    requestId: str = Field(..., description="Unique Request ID generated for this transaction")
    status: str = Field(default="accepted", description="Status of the submission: 'accepted'")
    message: str | None = Field(default="Submission accepted.", description="Human-readable response message")
    data: dict | None = Field(default=None, description="Optional payload response data")

class ErrorDetail(BaseModel):
    code: str = Field(..., description="Standardized error code (e.g., VALIDATION_ERROR)")
    message: str = Field(..., description="User-friendly error message description")
    details: list[dict] | None = Field(default=[], description="Detailed validation error list if applicable")

class SubmissionErrorResponse(BaseModel):
    success: bool = Field(default=False, description="Indicates if the operation failed")
    requestId: str = Field(..., description="Unique Request ID generated for this transaction")
    error: ErrorDetail
