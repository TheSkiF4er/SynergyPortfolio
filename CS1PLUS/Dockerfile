FROM python:3.11-slim

WORKDIR /app

# Install system deps (optional minimal)
RUN pip install --no-cache-dir --upgrade pip

COPY pyproject.toml README.md /app/
COPY src /app/src
COPY requirements.txt /app/
COPY web /app/web

RUN pip install --no-cache-dir -e .
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

# Default: show help
CMD ["birthdate", "--help"]
