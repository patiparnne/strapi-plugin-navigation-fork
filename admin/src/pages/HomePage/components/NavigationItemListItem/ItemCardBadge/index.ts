import { Badge } from '@strapi/design-system';
import styled from 'styled-components';

interface ItemCardBadgeProps {
  borderColor?: string;
  small?: boolean;
}

export const ItemCardBadge = styled(Badge).withConfig({
  shouldForwardProp: (prop) => !['small'].includes(prop),
})<ItemCardBadgeProps>`
  border: 1px solid ${({ theme, borderColor }) => borderColor ? theme.colors[borderColor as keyof typeof theme.colors] : 'transparent'};

  ${({ small, theme }) =>
    small &&
    `
			padding: ${theme.spaces[1]} ${theme.spaces[2]};
			margin: 0px ${theme.spaces[3]};
			vertical-align: middle;

			cursor: default;

			span {
				font-size: .65rem;
				line-height: 1;
				vertical-align: middle;
			}
		`}
`;
