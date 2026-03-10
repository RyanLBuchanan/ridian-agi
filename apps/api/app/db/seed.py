from app.core.db import Base, engine


if __name__ == "__main__":
    # TODO: Add seed fixtures for starter memory, agents, and tool metadata.
    Base.metadata.create_all(bind=engine)
    print("Database schema initialized.")
