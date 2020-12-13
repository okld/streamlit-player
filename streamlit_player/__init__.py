from collections import namedtuple
from pathlib import Path
from streamlit.components.v1 import declare_component

_RELEASE = True

if not _RELEASE:
    _component_func = declare_component("streamlit_player", url="http://localhost:3001")
else:
    _component_path = (Path(__file__).parent/"frontend"/"build").resolve()
    _component_func = declare_component("streamlit_player", path=_component_path)

_SUPPORTED_EVENTS = [
    "onStart", "onPlay", "onProgress", "onDuration", "onPause",
    "onBuffer", "onBufferEnd", "onSeek", "onEnded", "onError"
]

_PlayerEvent = namedtuple("PlayerEvent", ["name", "data"])


def st_player(
    url,
    height=None,
    playing=None,
    loop=None,
    controls=True,
    light=None,
    volume=None,
    muted=None,
    playback_rate=None,
    progress_interval=None,
    play_inline=None,
    events=None,
    config=None,
    key=None
):
    """Embed a video or music player.
    
    Parameters
    ----------
    url : str
        The url of a video or song to play.
    height : int or None 
        Set player height.
    playing : bool or None
        Set to true or false to pause or play the media.
    loop : bool or None
        Set to true or false to loop the media. 
    controls : bool
        Set to true or false to display native player controls.
        For Vimeo videos, hiding controls must be enabled by the video owner.
    light : bool or None
        Set to true to show just the video thumbnail, which loads the full player on click.
    volume : int or None
        Set the volume of the player, between 0 and 1.
        None sets default volume on all players.
    muted : bool or None
        Mutes the player. Only works if volume is set.
    playback_rate : int or None
        Set the playback rate of the player.
        Only supported by YouTube, Wistia, and file paths.
    progress_interval : int or None
        The time between onProgress callbacks, in milliseconds.
    play_inline : bool or None
        Applies the playsinline attribute where supported.
    events : [str] or None
        Events streamlit will receive feedbacks from.
        `onReady`, `onEnablePIP` and `onDisablePIP` are not supported.
        More information at https://github.com/cookpete/react-player#callback-props
    config : dict or None
        Override options for the various players.
        More information at https://github.com/cookpete/react-player#config-prop
    key : str or None
        An optional string to use as the unique key for the widget.
        If this is omitted, a key will be generated for the widget
        based on its content. Multiple widgets of the same type may
        not share the same key.

    """
    # Filter unsupported events and options
    events = [evt for evt in events if evt in _SUPPORTED_EVENTS] if events is not None else []

    # Load component
    event = _component_func(
        url=url, 
        height=height,
        playing=playing,
        loop=loop,
        controls=controls,
        light=light,
        volume=volume,
        muted=muted,
        playbackRate=playback_rate,
        progressInterval=progress_interval,
        playInline=play_inline,
        events=events,
        config=config,
        key=key,
        default={}
    )

    return _PlayerEvent(event.get("name", None), event.get("data", None))
