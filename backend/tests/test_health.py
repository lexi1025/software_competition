from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_check() -> None:
    response = client.get("/api/health")
    assert response.status_code == 200
    body = response.json()
    assert response.headers["X-Request-ID"] == body["trace_id"]
    assert body["success"] is True
    assert body["error"] is None
    assert body["data"]["status"] == "ok"
    assert body["data"]["app_name"] == "设备检修智能辅助系统"
