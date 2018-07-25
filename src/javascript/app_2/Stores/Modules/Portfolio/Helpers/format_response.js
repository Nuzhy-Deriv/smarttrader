import { localize }    from '../../../../../_common/localize';

export const formatPortfolioResponse = (portfolio_arr) => (
    portfolio_arr.map((portfolio_pos) => {
        const purchase       = parseFloat(portfolio_pos.buy_price);
        const payout         = parseFloat(portfolio_pos.payout);

        return {
            reference  : portfolio_pos.transaction_id,
            type       : portfolio_pos.contract_type,
            details    : localize(portfolio_pos.longcode.replace(/\n/g, '<br />')),
            payout,
            purchase,
            expiry_time: portfolio_pos.expiry_time * 1000,
            id         : portfolio_pos.contract_id,
            indicative : 0,
        };
    })
);
