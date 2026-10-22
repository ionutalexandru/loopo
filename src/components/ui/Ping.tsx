interface PingProps {
    color?: string;
    size?: number;
}

export const Ping = ({ color = 'deep-coral', size = 3 }: PingProps) => {
    return (
        <span className="relative flex size-3">
            <span
                className={`bg-${color} absolute inline-flex h-full w-full animate-ping rounded-full opacity-75`}
            ></span>
            <span
                className={`bg-${color} relative inline-flex size-${size} rounded-full`}
            ></span>
        </span>
    );
};
