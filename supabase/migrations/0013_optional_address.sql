-- Auto Style — checkout no longer collects a full street address (wilaya +
-- mairie is enough for delivery), so `orders.address` is no longer supplied
-- by the client. place_order() already inserts customer->>'address' as-is,
-- which becomes NULL once the key is absent from the payload — just drop
-- the NOT NULL constraint so those inserts stop failing.
ALTER TABLE orders ALTER COLUMN address DROP NOT NULL;
