```mermaid
sequenceDiagram
    actor Admin
    activate Admin
    Admin ->> UploadFileToTrain: Choose file up train chatbot
    activate UploadFileToTrain
    alt is confirmed
    UploadFileToTrain ->> Database: Load data of file and save to database as chatbot's knowledge
    activate Database
    Database -->> Admin: Notify train chatbot success
    deactivate Database
    else is not confirmed
    UploadFileToTrain -->> Admin: Display file management screen
    deactivate UploadFileToTrain
    end
    deactivate Admin
