import { Box, Typography } from '@mui/material';
import SparkleMascot from '../../assets/img/sparkle-mascot.png';

interface NoRequestsPlaceholderProps {
    /** the text to display in the placeholder */
    text: string;
    /** the image to display in the placeholder */
    image?: string;
    /** the alt text for the image */
    alt?: string;
}

/**
 * Placeholder for when there are no requests
 * @returns {JSX.Element} the placeholder
 */
export const NoRequestsPlaceholder = ({
    text,
    image = SparkleMascot,
    alt = 'Sparkle Mascot',
}: NoRequestsPlaceholderProps): JSX.Element => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginBottom: '4em',
                marginTop: '4em',
            }}
        >
            <img width="200" src={image} alt={alt} />
            <Typography variant="gray" sx={{ marginTop: '2em' }}>
                {text}
            </Typography>
        </Box>
    );
};
