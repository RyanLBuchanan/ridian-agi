from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_chat_placeholder() -> None:
    response = client.post("/api/chat", json={"message": "Hello, system"})
    assert response.status_code == 200
    payload = response.json()
    assert "runId" in payload
    assert "response" in payload
    assert "executionMode" in payload
    assert "traceSummary" in payload
    assert isinstance(payload.get("trace"), list)
