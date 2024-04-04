```mermaid
sequenceDiagram
    activate Admin
    actor Admin
    Admin ->> ExportCSV: Click on button Export CSV
    activate ExportCSV
    ExportCSV ->> Database: Get chat history data
    deactivate ExportCSV
    activate Database
    Database -->> Admin: Write data to csv file and send to admin
    deactivate Database
    deactivate Admin