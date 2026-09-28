import MyBasketView from '@/components/views/MyBasketView';

export const metadata = {
    title: 'My Basket | Loopo',
    description:
        'Your digital crafting basket. Keep track of active WIPs, row counters, and yarn details for all your knitting and crochet projects.',
};

export default function MyBasketPage() {
    return <MyBasketView />;
}
