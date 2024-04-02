```mermaid
sequenceDiagram
    actor Admin
    activate Admin
    Admin ->> DeleteFile: Click on delete file button
    activate DeleteFile
    alt confirmed
    DeleteFile ->> Database: Delete in database
    activate Database
    Database -->> Admin: Notify delete successfully
    deactivate Database
    else not confirmed
    DeleteFile -->> Admin: display list file management screen
    deactivate DeleteFile
    end
    deactivate Admin