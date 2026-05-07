from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_root_returns_envelope() -> None:
    response = client.get("/")

    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["error"] is None
    assert body["data"]["app_name"] == "设备检修智能辅助系统"
    assert response.headers["X-Request-ID"] == body["trace_id"]


def test_query_returns_success_envelope() -> None:
    response = client.post(
        "/api/query",
        json={"question": "发动机无法启动", "device_name": "摩托车发动机"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert body["error"] is None
    assert "answer" in body["data"]
    assert isinstance(body["data"]["plan"], list)
    assert isinstance(body["data"]["evidence"], list)


def test_query_validation_error_uses_error_envelope() -> None:
    response = client.post("/api/query", json={"question": ""})

    assert response.status_code == 422
    body = response.json()
    assert body["success"] is False
    assert body["data"] is None
    assert body["error"]["code"] == "VALIDATION_ERROR"
    assert response.headers["X-Request-ID"] == body["trace_id"]


def test_manual_register_missing_file_uses_error_envelope() -> None:
    response = client.post(
        "/api/manuals/register",
        json={
            "file_path": "missing.pdf",
            "device_name": "摩托车发动机",
        },
    )

    assert response.status_code == 404
    body = response.json()
    assert body["success"] is False
    assert body["data"] is None
    assert body["error"]["code"] == "NOT_FOUND"
    assert response.headers["X-Request-ID"] == body["trace_id"]


def test_trace_id_header_is_preserved() -> None:
    response = client.get("/api/health", headers={"X-Request-ID": "test-trace-id"})

    body = response.json()
    assert response.headers["X-Request-ID"] == "test-trace-id"
    assert body["trace_id"] == "test-trace-id"
