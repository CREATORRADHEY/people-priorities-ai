from pydantic import BaseModel, Field

class InformationSchema(BaseModel):
    title: str = Field(..., min_length=1, description="Title of the reported issue")
    description: str = Field(..., min_length=1, description="Detailed description of the issue")
    category: str = Field(..., min_length=1, description="Category of the issue")
    language: str = Field(..., min_length=1, description="Preferred language for communication")

class VoiceSchema(BaseModel):
    duration: float | None = Field(default=None, ge=0, description="Duration of the audio recording in seconds")

class ImageSchema(BaseModel):
    filename: str = Field(..., min_length=1, description="Filename of the uploaded image")
    mimeType: str = Field(..., min_length=1, description="MIME type of the image")
    size: int = Field(..., ge=0, description="Size of the image file in bytes")

class LocationSchema(BaseModel):
    latitude: float | None = Field(default=None, description="Latitude of the location")
    longitude: float | None = Field(default=None, description="Longitude of the location")
    accuracy: float | None = Field(default=None, description="Accuracy of the GPS coordinates in meters")
    locality: str | None = Field(default=None, description="Human-readable area or locality name")
    ward: str | None = Field(default=None, description="Ward identifier")
    landmark: str | None = Field(default=None, description="Nearby landmark")
    source: str = Field(..., pattern="^(gps|manual)$", description="Source of the location data: 'gps' or 'manual'")
    capturedAt: str = Field(..., min_length=1, description="ISO timestamp when the location was captured")

class SubmissionRequest(BaseModel):
    version: str = Field(..., min_length=1, description="Metadata schema version")
    createdAt: str = Field(..., min_length=1, description="ISO timestamp when the draft was completed")
    information: InformationSchema
    voice: VoiceSchema | None = None
    images: list[ImageSchema] = []
    location: LocationSchema | None = None
