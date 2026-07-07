from pydantic import BaseModel

class UploadResponseData(BaseModel):
    submissionId: str
    voiceUploaded: bool
    imagesUploaded: int

class UploadSuccessResponse(BaseModel):
    success: bool
    requestId: str
    status: str
    data: UploadResponseData
