import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

export interface Order {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
}

interface CreateOrder {
  productId: string;
  quantity: number;
}

@Injectable()
export class OrdersService {
  private readonly orders = new Map<string, Order>();
  private readonly inventory = new Map([['keyboard', 10]]);
  private nextOrderId = 1;

  async create(userId: string, request: CreateOrder): Promise<Order> {
    if (
      !userId ||
      !Number.isInteger(request.quantity) ||
      request.quantity < 1
    ) {
      throw new BadRequestException('Invalid order');
    }

    const available = this.inventory.get(request.productId);
    if (available === undefined) {
      throw new NotFoundException('Product not found');
    }
    if (available < request.quantity) {
      throw new BadRequestException('Insufficient inventory');
    }

    await this.reserveInventory(
      request.productId,
      available - request.quantity,
    );

    const order: Order = {
      id: String(this.nextOrderId++),
      userId,
      productId: request.productId,
      quantity: request.quantity,
    };
    this.orders.set(order.id, order);
    return order;
  }

  findOne(id: string): Order {
    const order = this.orders.get(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  private async reserveInventory(
    productId: string,
    remaining: number,
  ): Promise<void> {
    await Promise.resolve();
    this.inventory.set(productId, remaining);
  }
}
