```mermaid
sequenceDiagram
    actor Admin
    activate Admin
    Admin ->> DeleteUser: Click on delete file button
    activate DeleteUser
    alt confirmed
    DeleteUser ->> Database: Delete in database
    activate Database
    Database -->> Admin: Notify delete successfully
    deactivate Database
    else not confirmed
    DeleteUser -->> Admin: display list user management screen
    deactivate DeleteUser
    end
    deactivate Admin