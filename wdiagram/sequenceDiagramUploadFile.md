```mermaid
sequenceDiagram
    activate Admin
    actor Admin
    Admin ->> UploadFile: Click on upload file button
    activate UploadFile
    UploadFile ->> Validate: Validate file
    deactivate UploadFile
    activate Validate
    alt file is valid
    Validate ->> Database: Save file information to database
    activate Database
    Database ->> Admin: Notify upload file successfully
    deactivate Database
    else file is invalid
    Validate -->> Admin: Invalid uploaded file
    end
    deactivate Validate
    deactivate Admin