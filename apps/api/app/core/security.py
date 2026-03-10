from dataclasses import dataclass


@dataclass
class SecurityContext:
    user_id: str = "single-user"
    role: str = "owner"
