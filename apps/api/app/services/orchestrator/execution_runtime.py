class ExecutionRuntime:
    def summarize(self, plan_steps: list[str]) -> str:
        return " -> ".join(plan_steps)
