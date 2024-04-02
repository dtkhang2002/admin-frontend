```mermaid
classDiagram
    class BaseModel{
        - int id
        - datetime created_at
        - datetime updated_at
    }
    class Person{
        - string email
        - string password
        - int role_id
        + login() void
    }
    class Admin{
        - List~Trainfile~ listFile
        - List~History~ listHistory
        + uploadFile(File file) void
        + displayListFile() List~Trainfile~
        + searchFile() List~Trainfile~
        + deleteTrainfile(int trainFileId) void
        + trainChatbot() void
        + displayListChatHistory() List~History~
        + searchChatHistory() List~History~
        + displaySettings() Settings
        + updateSettings(Settings settings) Settings
        + displayListUser() List~User~
        + addUser(User user) User
        + updateUser(int userId, User user) User
        + deleteUser(int userId) void
    }
    class User {
        + askQuestion() string
    }
    class Chatbot {
        + generateAnswer(string question) string
    }
    class Settings{
        - float threshold_score
        - int number_references
        - float temperature
        - int maximum_number_question
        - string prompt_question
        - string prompt_answer
    }
    class Trainfile{
        - string filePath
        - string fileName
    }
    class History{
        - string question
        - string answer
    }
    BaseModel <|-- Settings
    BaseModel <|-- Person
    BaseModel <|-- Trainfile
    BaseModel <|-- History
    Person <|-- Admin
    Person <|-- User
    Trainfile o-- Admin
    History o-- Admin