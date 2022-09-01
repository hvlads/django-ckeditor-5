import os

import pytest


@pytest.fixture
def file():
    file_path = os.path.join(os.path.dirname(__file__), "fixtures", "files", "test.png")
    return open(file_path, "rb")
