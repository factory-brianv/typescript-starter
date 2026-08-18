import { BadRequestException } from '@nestjs/common';
import { OrdersService } from './orders.service';

describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(() => {
    service = new OrdersService();
  });

  it('creates and retrieves an order', async () => {
    const order = await service.create('user-123', {
      productId: 'keyboard',
      quantity: 2,
    });

    expect(service.findOne(order.id)).toEqual(order);
  });

  it('rejects an order when inventory is insufficient', async () => {
    await expect(
      service.create('user-123', {
        productId: 'keyboard',
        quantity: 11,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
