/**
 * UUID type returned by Hue for resource IDs
 */
export type HueUUID = string;

/**
 * Standard Hue error object
 */
export interface HueApiError {
  description: string;
}

/**
 * Generic list response wrapper
 */
export interface HueApiListResponse<T> {
  errors: HueApiError[];
  data: T[];
}

/**
 * Resource identifier object used in children/services lists
 */
export interface ResourceIdentifier {
  rid: HueUUID;
  rtype:
    | 'device'
    | 'bridge_home'
    | 'room'
    | 'zone'
    | 'service_group'
    | 'light'
    | 'button'
    | 'bell_button'
    | 'relative_rotary'
    | 'temperature'
    | 'light_level'
    | 'motion'
    | 'camera_motion'
    | 'entertainment'
    | 'contact'
    | 'tamper'
    | 'convenience_area_motion'
    | 'security_area_motion'
    | 'speaker'
    | 'grouped_light'
    | 'grouped_motion'
    | 'grouped_light_level'
    | 'device_power'
    | 'device_software_update'
    | 'zigbee_connectivity'
    | 'zgp_connectivity'
    | 'bridge'
    | 'motion_area_candidate'
    | 'wifi_connectivity'
    | 'zigbee_device_discovery'
    | 'homekit'
    | 'matter'
    | 'matter_fabric'
    | 'scene'
    | 'entertainment_configuration'
    | 'public_image'
    | 'auth_v1'
    | 'behavior_script'
    | 'behavior_instance'
    | 'geofence_client'
    | 'geolocation'
    | 'smart_scene'
    | 'motion_area_configuration'
    | 'clip';
}

/* ============================================================================
 * LightGet and related subtypes
 * ========================================================================== */

/** Base for all Hue lights */
export interface HueLightBase {
  type: 'light';
  id: HueUUID;
  id_v1?: string;
  owner?: ResourceIdentifier;
  metadata?: {
    name?: string;
    archetype?: string;
  };
  product_data?: {
    model_id: string;
    manufacturer_name: string;
    product_name: string;
    product_archetype: string;
    certified: boolean;
    software_version: string;
    hardware_platform_type?: string;
  };
  identify?: unknown;
  service_id?: number;
}

/** On/Off feature */
export interface LightOn {
  on: {
    on: boolean;
  };
}

/** Dimming feature */
export interface LightDimming {
  dimming: {
    brightness: number;
    min_dim_level?: number;
  };
}

/** Dimming delta feature */
export interface LightDimmingDelta {
  dimming_delta: {
    action?: 'up' | 'down' | 'stop';
    brightness_delta?: number;
  };
}

/** Color temperature feature */
export interface LightColorTemperature {
  color_temperature: {
    mirek: number;
    mirek_valid: boolean;
    mirek_schema?: {
      mirek_minimum: number;
      mirek_maximum: number;
    };
  };
}

/** Color temperature delta */
export interface LightColorTemperatureDelta {
  color_temperature_delta: {
    action?: 'up' | 'down' | 'stop';
    mirek_delta?: number;
  };
}

/** XY color */
export interface XYColor {
  x: number;
  y: number;
}

/** Color gamut */
export interface ColorGamut {
  red: XYColor;
  green: XYColor;
  blue: XYColor;
}

/** Color feature */
export interface LightColor {
  color: {
    xy: XYColor;
    gamut?: ColorGamut;
    gamut_type?: string;
  };
}

/** Dynamics status */
export type DynamicsStatus = 'none' | 'dynamic_palette';

export interface LightDynamics {
  dynamics: {
    status: DynamicsStatus;
    status_values: DynamicsStatus[];
    speed: number;
    speed_valid: boolean;
  };
}

/** Alert effects */
export type AlertEffectType = 'breathe' | 'okay' | 'channel_change';

export interface LightAlert {
  alert: {
    action_values: AlertEffectType[];
  };
}

/** Signaling */
export type SupportedSignals = 'no_signal' | 'notification';

export interface ColorFeatureBasicGet {
  xy?: XYColor;
  color_temperature?: {
    mirek: number;
  };
}

export interface LightSignaling {
  signaling: {
    signal_values: SupportedSignals[];
    status?: {
      signal: SupportedSignals;
      estimated_end?: string;
      colors?: ColorFeatureBasicGet[];
    };
  };
}

/** Mode */
export type Mode = 'normal' | 'streaming';

/** Gradient */
export type GradientMode = 'interpolated_palette';
export type SupportedGradientModes = GradientMode;

export interface GradientPointGet {
  color?: ColorFeatureBasicGet;
}

export interface LightGradient {
  gradient: {
    points: GradientPointGet[];
    mode: GradientMode;
    points_capable: number;
    mode_values: SupportedGradientModes[];
    pixel_count: number;
  };
}

/** Effects v1 */
export type SupportedEffects =
  | 'prism'
  | 'opal'
  | 'glisten'
  | 'sparkle'
  | 'fire'
  | 'candle'
  | 'underwater'
  | 'cosmos'
  | 'sunbeam'
  | 'enchant'
  | 'no_effect';

export type EffectsStatus = SupportedEffects;

export interface LightEffects {
  effects: {
    status: EffectsStatus;
    status_values: EffectsStatus[];
    effect_values: SupportedEffects[];
  };
}

/** Effects v2 */
export interface LightEffectsV2 {
  effects_v2: {
    action?: {
      effect_values: SupportedEffects[];
    };
    status?: {
      effect: EffectsStatus;
      effect_values: SupportedEffects[];
      parameters?: {
        color?: {
          xy?: XYColor;
          color_temperature?: {
            mirek: number;
            mirek_valid: boolean;
            speed: number;
          };
        };
      };
    };
  };
}

/** Timed effects */
export type SupportedTimedEffects = 'sunrise' | 'sunset';
export type TimedEffectsStatus = SupportedTimedEffects | 'no_effect';

export interface LightTimedEffects {
  timed_effects: {
    status: TimedEffectsStatus;
    status_values: TimedEffectsStatus[];
    effect_values: SupportedTimedEffects[];
  };
}

/** Powerup */
export type PowerupPreset = 'safety' | 'last_on_state' | 'custom';
export type ColorMode = 'color' | 'color_temperature';

export interface LightPowerup {
  powerup: {
    preset: PowerupPreset;
    configured: boolean;
    on?: {
      on: boolean;
    };
    dimming?: {
      mode: Mode;
      dimming: {
        brightness: number;
      };
    };
    color?: {
      mode: ColorMode;
      color_temperature?: {
        mirek: number;
      };
      color?: {
        xy: XYColor;
      };
    };
  };
}

/** Content configuration */
export interface LightContentConfiguration {
  content_configuration: {
    orientation?: {
      status: 'seated' | 'changing';
      configurable: boolean;
      orientation: 'horizontal' | 'vertical';
    };
    order?: {
      status: 'seated' | 'changing';
      configurable: boolean;
      order: 'forward' | 'reversed';
    };
  };
}

/** Final LightGet combining all features */
export type LightGet = HueLightBase &
  Partial<LightOn> &
  Partial<LightDimming> &
  Partial<LightDimmingDelta> &
  Partial<LightColorTemperature> &
  Partial<LightColorTemperatureDelta> &
  Partial<LightColor> &
  Partial<LightDynamics> &
  Partial<LightAlert> &
  Partial<LightSignaling> &
  Partial<LightGradient> &
  Partial<LightEffects> &
  Partial<LightEffectsV2> &
  Partial<LightTimedEffects> &
  Partial<LightPowerup> &
  Partial<LightContentConfiguration>;
