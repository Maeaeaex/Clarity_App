import numpy as np
from scipy.signal import bessel, sosfiltfilt
from scipy import integrate

def bessel_bandpass(data: np.ndarray, edges: list, sample_rate: float, poles: int = 2):
    sos = bessel(poles, edges, btype='bandpass', fs=sample_rate, output='sos')
    padlen = 3 * (max(len(sos), 1) - 1)  # grobe Schätzung
    print(f"Length of data: {len(data)}, padlen: {padlen}")
    return sosfiltfilt(sos, data)

def process_acceleration(times, accel, sample_rate=125):
    # Bandpass filter
    filtered = bessel_bandpass(np.array(accel), [0.07, 0.20], sample_rate)
    # Remove edge effects if needed (e.g., filtered = filtered[p:-q])
    #p, q = 1250, 1
    #filtered = filtered[p:-q]
    #times = times[p:-q]
    # Velocity (first integration)
    vel = integrate.cumulative_trapezoid(filtered, times)
    vel -= np.mean(vel)
    # Position (second integration)
    pos = integrate.cumulative_trapezoid(vel, times[:-1])
    pos -= np.mean(pos)

    print(f"Returning position length: {len(pos)}, times length: {len(times[:-2])}")
    return {
        "filtered": filtered.tolist(),
        "velocity": vel.tolist(),
        "position": pos.tolist(),
        "times": times[:-2].tolist()
    }
