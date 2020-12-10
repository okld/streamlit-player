import streamlit.components.v1 as components
from collections import namedtuple
from pathlib import Path
from typing import List, Dict, Optional, Any

_RELEASE = True

if not _RELEASE:
    _component_func = components.declare_component("streamlit_player", url="http://localhost:3001")
else:
    _component_path = (Path(__file__).parent/"frontend"/"build").resolve()
    _component_func = components.declare_component("streamlit_player", path=_component_path)

_SUPPORTED_EVENTS = [
    "onStart", "onPlay", "onProgress", "onDuration", "onPause",
    "onBuffer", "onBufferEnd", "onSeek", "onEnded", "onError",
    "onEnablePIP", "onDisablePIP"
]

_SUPPORTED_OPTIONS = [
    "playing", "loop", "controls", "light", "volume", "muted",
    "playbackRate", "height", "style", "progressInterval",
    "playsinline", "config"
]

_PlayerEvent = namedtuple("PlayerEvent", ["name", "data"])


def st_player(
    url: str,
    events: Optional[List[str]] = None,
    key: Optional[Any] = None,
    **options: Any,
) -> Optional[_PlayerEvent]:
    """Embed a video or music player."""

    # Filter unsupported events and options
    events = [evt for evt in events if evt in _SUPPORTED_EVENTS] if events is not None else []
    options = {opt: val for opt, val in options.items() if opt in _SUPPORTED_OPTIONS}

    # Set default values for options
    options.setdefault("controls", True)

    # Load component
    event = _component_func(url=url, events=events, options=options, key=key, default={})

    return _PlayerEvent(event.get("name", None), event.get("data", None))
