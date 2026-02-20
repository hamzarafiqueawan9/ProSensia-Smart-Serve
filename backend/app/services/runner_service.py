from collections import defaultdict
from asyncio import Lock

runner_load = defaultdict(int)
runner_lock = Lock()
MAX_CAPACITY = 5
TOTAL_RUNNERS = 3

async def assign_runner():
    async with runner_lock:
        # Find all runners under MAX_CAPACITY
        available_runners = [r for r in range(1, TOTAL_RUNNERS + 1) if runner_load[r] < MAX_CAPACITY]

        if not available_runners:
            # Reset all loads if everyone reached max
            for r in range(1, TOTAL_RUNNERS + 1):
                runner_load[r] = 0
            available_runners = list(range(1, TOTAL_RUNNERS + 1))

        # Pick the runner with the minimum load
        runner_id = min(available_runners, key=lambda r: runner_load[r])
        runner_load[runner_id] += 1
        return runner_id

async def release_runner(runner_id: int):
    async with runner_lock:
        if runner_load[runner_id] > 0:
            runner_load[runner_id] -= 1
