import stylex from '@stylexjs/stylex'
import { 
  genSVGCubicBezier, 
  type IconProps 
} from '../util'
import { MainCircle, SecondaryCircle } from './IconCircle'

const style = stylex.create({
  error: {
    overflow: 'visible'
  }
})

export function Error(props: IconProps) {
  const fill = props.primary || '#FF3B30';
  return (
    <svg {...stylex.attrs(style.error)} viewBox="0 0 32 32" width="1.25rem" height="1.25rem">
      <MainCircle fill={fill} />
      <SecondaryCircle fill={fill} />
      <path
        fill="none"
        stroke={props.secondary || '#FFFFFF'}
        stroke-width="4"
        stroke-dasharray="9"
        stroke-dashoffset="9"
        stroke-linecap="round"
        d="M16,7l0,9"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="9;0"
          dur="0.2s"
          begin="250ms"
          fill="freeze"
          {...genSVGCubicBezier('0.0, 0.0, 0.58, 1.0')}
        />
      </path>
      <circle fill={props.secondary || '#FFFFFF'} cx="16" cy="23" r="2.5" opacity="0">
        <animate
          attributeName="opacity"
          values="0;1"
          dur="0.25s"
          begin="350ms"
          fill="freeze"
          {...genSVGCubicBezier('0.0, 0.0, 0.58, 1.0')}
        />
      </circle>
    </svg>
  );
};
