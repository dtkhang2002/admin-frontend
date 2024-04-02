```mermaid
sequenceDiagram
    activate Admin
    actor Admin
    Admin ->> Settings: Click update settings button
    activate Settings
    Settings ->> Validate: Validate settings information
    deactivate Settings
    activate Validate
    alt settings information is valid
        Validate ->> Database: Update old settings information
        activate Database
        Database -->> Admin: Notify update settings successfully
        deactivate Database
    else settings information is invalid
        Validate -->> Admin: Notify invalid settings information
    end
    deactivate Validate
    deactivate Admin