from datetime import datetime


def echo_tool(payload: dict[str, object]) -> dict[str, object]:
    return {
        "tool": "echo",
        "timestamp": datetime.utcnow().isoformat(),
        "payload": payload,
    }


BUILTIN_TOOLS = {
    "echo": echo_tool,
}
