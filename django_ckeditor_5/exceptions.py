class NoImageException(Exception):
    """
    Exception raised when the file is not a valid image.
    """

    def __init__(self, message="File is not a valid image"):
        self.message = message
        super().__init__(self.message)
